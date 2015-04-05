class Nakkitype < ActiveRecord::Base
  attr_accessible :name, :nakkitype_info_id

  belongs_to :party
  has_many :nakkis, :dependent => :delete_all
  belongs_to :nakkitype_info

  validates :name, :presence => true, :length => {
    :minimum => 2,
    :maximum => 20,
    :too_short => "2 characters is minimum allowed",
    :too_long => "20 characters is maximum allowed"
  }
  validates :party_id, :presence => true
  validates :nakkitype_info_id, :presence => true
  validates_uniqueness_of :name, :scope => [:party_id]
end
