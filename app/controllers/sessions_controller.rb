class SessionsController < ApplicationController
  skip_before_filter :require_login, :only => [:create]

  def create
    user = User.authenticate(params[:email], params[:password])
    if user
      session[:user_id] = user.id
      render :json => user, :notice => "Logged in!"
    else
      render :text => "failed"
      #redirect_to root_url, :notice => "Invalid email or password"
    end
  end
  
  def destroy
    session[:user_id] = nil
    redirect_to root_url, :notice => "Logged out!"
  end
end
