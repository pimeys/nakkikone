class NakitController < ApplicationController

  def index
    current_party = Party.find(params[:party_id])
    nakkilist = []
    current_party.nakkitypes.each{ |t| nakkilist += t.nakkis }

    render :json => nakkilist, :root => false
  end

  def update
    nakki = Nakki.find(params[:id])
    nakki.user = current_user

    if nakki.save
      render :json => nakki
    else
      render :status => 500, :text => "what what"
    end
  end
end
