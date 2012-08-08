class Nakkitype < ActiveRecord::Base
  attr_accessible :name

  belongs_to :party
  has_many :nakkis, :dependent => :delete_all
  
  def as_json(options={})
    {
      :id => id,
      :type => name,
      :start => nakkis.first.slot,
      :end => nakkis.last.slot
    }
  end
end
