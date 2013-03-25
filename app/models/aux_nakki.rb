class AuxNakki < ActiveRecord::Base
  attr_accessible :nakkiname
  validates_uniqueness_of :nakkiname, :scope => [:user_id, :party_id]

  belongs_to :user
end
