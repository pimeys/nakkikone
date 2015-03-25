class NakkitypeInfo < ActiveRecord::Base
  attr_accessible :description, :id, :title

  belongs_to :nakkitype

  validates :title, :presence => true, :length => {
              :minimum => 2,
              :maximum => 50,
              :too_short => "#{count} character is minimum allowed",
              :too_long => "#{count} character is maximum allowed"
            }
  validates_uniqueness_of :title
end
