class NakitController < ApplicationController
  skip_before_filter :require_login
  
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

end
