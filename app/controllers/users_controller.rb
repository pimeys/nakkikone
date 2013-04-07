class UsersController < ApplicationController
  skip_before_filter :require_login

  def new
    user = User.new
  end
  
  def create
    user = User.new(params[:user])
    user.role = "user";
    if user.save
      render :json => user
    else
      render :status => 400, :json => user.errors
    end
  end
  
  def home
  end
end
