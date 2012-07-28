class Nakki < ActiveRecord::Base
  attr_accessible :slot, :assign, :type

  has_many :nakkis
  has_many :users
  has_many :nakkitypes
  
  def as_json(options={})
    {
      :id => id,
      :slot => slot,
      :assign => assign,
      :type => type
    }
  end
end
