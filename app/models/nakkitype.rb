class Nakkitype < ActiveRecord::Base
  attr_accessible :type, :starttime, :endtime

  belongs_to :party
  has_many :nakkis
  
  def as_json(options={})
    {
      :id => id,
      :type => type,
      :start => starttime,
      :end => endtime
    }
  end
end
