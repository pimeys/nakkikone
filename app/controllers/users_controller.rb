class UsersController < ApplicationController
  skip_before_filter :require_login, :only => [:new, :create, :home, :reset_password]

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

  def reset_password
    user = User.where(:email => params[:email]).first
    if user
      new_password = User.generate_random_password(8)
      user.password = new_password
      user.password_confirmation = new_password
      if user.save
        PasswordResetMailer.password_reset(user, new_password).deliver
        render :status => 200, :text => "done"
      else
        render :status => 400, :json => errors
      end
    end
    render :status => 200, :text => "done"
  end
end
