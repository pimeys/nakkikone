class PartiesController < ApplicationController
  skip_before_filter :require_login
  
  def index
    redirect_to root_url + 'mock-data/parties.json'
  end

  def show
    redirect_to root_url + 'mock-data/' + params[:id] + '/details'
  end
end
