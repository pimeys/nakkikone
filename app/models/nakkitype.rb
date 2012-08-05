class Nakkitype < ActiveRecord::Base
  attr_accessible :name, :starttime, :endtime

  belongs_to :party
  has_many :nakkis, :dependent => :delete_all
  
  def as_json(options={})
    {
      :id => id,
      :type => name,
      :start => starttime,
      :end => endtime
    }
  end
end
