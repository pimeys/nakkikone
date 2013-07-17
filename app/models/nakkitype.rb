class Nakkitype < ActiveRecord::Base
  attr_accessible :name

  belongs_to :party
  has_many :nakkis, :dependent => :delete_all

  validates :name, :presence => true, :length => {
    :minimum => 2,
    :maximum => 20,
    :too_short => "#{count} character is minimum allowed",
    :too_long => "#{count} character is maximum allowed"
  }
  validates :party_id, :presence => true
  validates_uniqueness_of :name, :scope => [:party_id]
end
