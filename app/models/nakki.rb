class Nakki < ActiveRecord::Base
  attr_accessible :slot, :assign, :type

  belongs_to :user
  belongs_to :nakkitypes
  belongs_to :party
  
  def as_json(options={})
    {
      :id => id,
      :slot => slot,
      :assign => assign,
      :type => type
    }
  end
end
