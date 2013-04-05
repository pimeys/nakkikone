class User < ActiveRecord::Base
  attr_accessible :email, :password, :password_confirmation, :name, :number, :role, :nick
  
  attr_accessor :password
  before_save :encrypt_password
  
  validates_confirmation_of :password
  validates_presence_of :password, :on => :create
  
  validates :email, 
  :presence => true, 
  :uniqueness => { :case_sensitive => false }, 
  :format => { 
    :with => /^.+@.+$/, #TODO replace with better one
    :message => "%{value} is not valid email (our opinion, you might disagree)"
  }

  validates :role, :inclusion => { 
    :in => %w(admin user), 
    :message => "%{value} is not valid role"
  }

  validates_presence_of :name, :nick
  
  def self.authenticate(email, password)
    user = find_by_email(email)
    if user && user.password_hash == BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    else
      nil
    end
  end
  
  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end

  class Unauthorized < StandardError
  end

  class Unauthenticated < StandardError
  end
end
