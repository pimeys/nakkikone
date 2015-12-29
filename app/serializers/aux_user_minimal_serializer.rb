class AuxUserMinimalSerializer < ActiveModel::Serializer
  attributes :id, :name
  attribute :nakkiname, :key => :type

  # todo kill this unholy bastard
  def id
    object.id
  end

  def name
    object.user.nick
  end
end
