class ParcipitantsController < ApplicationController
  before_filter :admin_access
  skip_before_filter :admin_access, :only => :cancel_all_from_current_user

  def index
    current_party = get_current_party
    nakkilist = []
    current_party.nakkitypes.each{ |t| nakkilist += t.nakkis }
    parcipitants = nakkilist.map{ |nakki| nakki.user }
    
    render :json => parcipitants.select{ |t| !t.nil? }.uniq{ |t| t.email }, :root => false
  end

  def destroy
    current_party = get_current_party
    cancel_all_from_user current_party, params[:id]
    render :json => {}
  end

  def aux_index
    current_party = get_current_party
    parcipitants_in_nakkis = current_party.aux_nakkis.select{ |t| !t.user.nil? }.uniq
    render :json => parcipitants_in_nakkis, :root => false, :each_serializer => AuxUserSerializer
  end

  def cancel_all_from_current_user
    current_party = get_current_party
    cancel_all_from_user current_party, current_user.id
    current_party.aux_nakkis.select{ |nakki| 
      nakki.user_id == current_user.id.to_i 
    }.each{ |t|
      t.destroy
    }
    render :json => {}
  end

  private 
  
  def cancel_all_from_user(party, user_id)
    party.nakkitypes.each{ |type| 
      type.nakkis.select{ |nakki|
        nakki.user_id == user_id.to_i
      }.each{ |nakki| 
        nakki.user = nil 
        nakki.save 
      }}
  end
end
