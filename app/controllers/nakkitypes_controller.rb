class NakkitypesController < ApplicationController
  skip_before_filter :require_login
  
  def index
    @nakkitypes = Nakkitype.where(:party_id => params[:party_id])
    respond_to do |format|
      format.json { render :json => @nakit}
    end
  end

  def update
    
  end

  def new
    
  end

end
