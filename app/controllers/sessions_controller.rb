class SessionsController < ApplicationController
  skip_before_filter :require_login, :only => [:create, :new]

  def new
    if current_user
      render :json => current_user
    else
      raise User::Unauthenticated
    end
  end

  def create
    user = User.authenticate(params[:email], params[:password])
    if user
      session[:user_id] = user.id
      render :json => user, :notice => "Logged in!"
    else
      raise User::Unauthorized
    end
  end
  
  def destroy
    session[:user_id] = nil
    redirect_to root_url, :notice => "Logged out!"
  end
end
