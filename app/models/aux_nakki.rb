class AuxNakki < ActiveRecord::Base
  attr_accessible :nakkiname

  belongs_to :user
end
