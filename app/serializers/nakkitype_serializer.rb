class NakkitypeSerializer < ActiveModel::Serializer
  attributes :id, :start_time, :end_time

  attribute :nakkitype_info, :key => :info

  def start_time
    object.nakkis.first.slot
  end

  def end_time
    object.nakkis.last.slot
  end
end
