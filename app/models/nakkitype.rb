class Nakkitype < ActiveRecord::Base
  attr_accessible :name

  belongs_to :party
  has_many :nakkis, :dependent => :delete_all  
end
