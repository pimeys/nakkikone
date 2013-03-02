class NakkiSerializer < ActiveModel::Serializer
  attributes :id, :slot, :type
  has_one :assign, :serializer => OnlyUserNameSerializer
  
  def type
    object.nakkitype.name
  end

  def assign
    object.user
  end
end
