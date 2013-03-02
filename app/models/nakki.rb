class Nakki < ActiveRecord::Base
  attr_accessible :slot

  belongs_to :user
  belongs_to :nakkitype  
end
