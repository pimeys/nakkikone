class ParcipitantsController < ApplicationController
  before_filter :admin_access

  def index
    current_party = Party.find(params[:party_id])
    nakkilist = []
    current_party.nakkitypes.each{ |t| nakkilist += t.nakkis }
    parcipitants = nakkilist.map{ |nakki| nakki.user }
    
    render :json => parcipitants.select{ |t| !t.nil? }, :root => false
  end

  def aux_index
    current_party = Party.find(params[:party_id])
    parcipitants = current_party.aux_nakkis.select{ |t| !t.user.nil? }.map{ |nakki| 
      user = nakki.user 
      user.name = nakki.name
      user
    }
    
    render :json => parcipitants, :root => false
  end

end
