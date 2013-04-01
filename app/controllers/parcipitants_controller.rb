class ParcipitantsController < ApplicationController
  before_filter :admin_access

  def index
    current_party = get_current_party
    nakkilist = []
    current_party.nakkitypes.each{ |t| nakkilist += t.nakkis }
    parcipitants = nakkilist.map{ |nakki| nakki.user }
    
    render :json => parcipitants.select{ |t| !t.nil? }.uniq{ |t| t.email }, :root => false
  end

  def destroy
    current_party = get_current_party
    
    current_party.nakkitypes.each{ |type| 
      type.nakkis.select{ |nakki|
        nakki.user_id == params[:id].to_i
      }.each{ |nakki| 
        nakki.user = nil 
        nakki.save 
      }}

    render :json => {}
  end

  def aux_index
    current_party = get_current_party
    parcipitants_in_nakkis = current_party.aux_nakkis.select{ |t| !t.user.nil? }.uniq
    render :json => parcipitants_in_nakkis, :root => false, :each_serializer => AuxUserSerializer
  end
end
