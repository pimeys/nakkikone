class NakitController < ApplicationController
  
  def index
    @current_party = Party.find(params[:party_id])
    @nakkilist = []
    @current_party.nakkitypes.each{ |t|
      @nakkilist += t.nakkis
    }
    
    respond_to do |format|
      format.json { render :json => @nakkilist}
    end
  end

  def update
    @nakki = Nakki.find(params[:id])
    @nakki.user = User.find(params[:assign])

    if @nakki.save
      respond_to do |format|
        format.json { render :json => @nakki}
      end
    end
  end
end
