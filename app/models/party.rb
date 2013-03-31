class Party < ActiveRecord::Base
  attr_accessible :title, :description, :date, :info_date

  has_many :nakkis, :dependent => :delete_all
  has_many :aux_nakkis, :dependent => :delete_all
  has_many :users
  has_many :nakkitypes, :dependent => :delete_all
  
  validates :title, :presence => true
  validates :description, :presence => true
  validates :date, :presence => true
  validates :info_date, :presence => true 
end
