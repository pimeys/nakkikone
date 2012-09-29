class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user
  before_filter :require_login

  private

  def require_login
    unless logged_in?
      redirect_to login_url
    end
  end
  
  def current_user
   # @current_user ||= User.find(session[:user_id]) if session[:user_id]
   # render :nothing => true, :status => 200, :content_type => 'text/html'
  end

  # The logged_in? method simply returns true if the user is logged
  # in and false otherwise. It does this by "booleanizing" the
  # current_user method we created previously using a double ! operator.
  # Note that this is not common in Ruby and is discouraged unless you
  # really mean to convert something into true or false.
  def logged_in?
    true #!!current_user
  end
end
