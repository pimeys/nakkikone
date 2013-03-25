class UsersController < ApplicationController
  skip_before_filter :require_login

  def new
    user = User.new
  end
  
  def create
    user = User.new(params[:user])
    if user.save
      render :json => user
    else
      render :text => "failed to signup"
    end
  end
  
  def home
  end
end
