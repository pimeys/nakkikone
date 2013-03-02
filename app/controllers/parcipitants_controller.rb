class ParcipitantsController < ApplicationController
  before_filter :admin_access

  def index
    current_party = Party.find(params[:party_id])
    nakkilist = []
    current_party.nakkitypes.each{ |t| nakkilist += t.nakkis }
    parcipitants = nakkilist.map{ |nakki| nakki.user }
    
    render :json => parcipitants.select{ |t| !t.nil? }, :root => false
  end
end
