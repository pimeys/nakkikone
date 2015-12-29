class NakkiSerializer < ActiveModel::Serializer
  attributes :id, :slot, :type, :nakkitype_id

  has_one :assign, :serializer => OnlyUserNameSerializer

  def type
    info = object.nakkitype.nakkitype_info
    if info.nil? then "old-nakki" else info.title end
  end

  def assign
    object.user
  end
end
