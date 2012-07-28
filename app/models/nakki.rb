class Nakki < ActiveRecord::Base
  attr_accessible :slot, :assign, :type

  belongs :user
  belongs :nakkitypes
  belongs :party
  
  def as_json(options={})
    {
      :id => id,
      :slot => slot,
      :assign => assign,
      :type => type
    }
  end
end
