class ParcipitantsController < ApplicationController
  skip_before_filter :require_login
  
  def index
    # @parcipititants = Users.where(:party_id => params[:party_id])
    respond_to do |format|
      format.json { render :json => '[{"id":"1","name":"foobar","email":"foo@var.com","number":"030120134"}]'}
    end
  end
end
