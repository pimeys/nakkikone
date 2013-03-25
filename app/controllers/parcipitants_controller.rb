class ParcipitantsController < ApplicationController
  before_filter :admin_access

  def index
    current_party = get_current_party
    nakkilist = []
    current_party.nakkitypes.each{ |t| nakkilist += t.nakkis }
    parcipitants = nakkilist.map{ |nakki| nakki.user }
    
    render :json => parcipitants.select{ |t| !t.nil? }, :root => false
  end

  def aux_index
    current_party = get_current_party
    parcipitants_in_nakkis = current_party.aux_nakkis.select{ |t| !t.user.nil? }.map{ |nakki| nakki}
    render :json => parcipitants_in_nakkis, :root => false, :each_serializer => AuxUserSerializer
  end

end
