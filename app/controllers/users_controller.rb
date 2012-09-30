class UsersController < ApplicationController
  skip_before_filter :require_login

  def new
    user = User.new
  end
  
  def create
    user = User.new(params[:user])
    if user.save
      render :json => user, :notice => "Signed up!"
    else
      render :text => "something failed"
    end
  end
  
  def home
  end
end
