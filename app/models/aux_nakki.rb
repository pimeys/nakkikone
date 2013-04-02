class AuxNakki < ActiveRecord::Base
  attr_accessible :nakkiname

  belongs_to :user

  validates_uniqueness_of :nakkiname, :scope => [:user_id, :party_id]
  validates :user_id, :presence => true
end
