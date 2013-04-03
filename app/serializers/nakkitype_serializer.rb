class NakkitypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :start, :end

  attribute :name, :key => :type

  def start
    #TODO remove, not needed with params validation
    if object.nakkis.empty?
      0
    else
      object.nakkis.first.slot
    end
  end

  def end
    #TODO remove, not needed with params validation
    if object.nakkis.empty?
      0
    else
      object.nakkis.last.slot
    end
  end
end
