class NakkitypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :start, :end

  attribute :name, :key => :type

  def start
    object.nakkis.first.slot
  end

  def end
    object.nakkis.last.slot
  end
end
