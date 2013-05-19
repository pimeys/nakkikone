class UsersController < ApplicationController
  skip_before_filter :require_login, :only => [:new, :create, :home]

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

  def update
    current_role = current_user.role
    current_user.update_attributes(params[:user])
    current_user.update_attributes({:role => current_role})
    if current_user.save
      render :json => current_user
    else
      errors = current_user.errors
      @current_user = User.find(session[:user_id])
      render :status => 400, :json => errors
    end
  end

  def home
  end
end
