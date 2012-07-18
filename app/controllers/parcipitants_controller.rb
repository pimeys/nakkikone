class ParcipitantsController < ApplicationController
  skip_before_filter :require_login
  
  def index
      redirect_to root_url + 'mock-data/' + params[:party_id] + '/parcipitants'
  end
end
