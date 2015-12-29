class PartySerializer < ActiveModel::Serializer
  attributes :id, :title, :date, :description, :aux_jobs_enabled
  attribute :info_date, :key => :infoDate
  attribute :aux_jobs_enabled, :key => :auxJobsEnabled
end
