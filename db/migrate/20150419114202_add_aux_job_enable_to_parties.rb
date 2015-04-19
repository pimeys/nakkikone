class AddAuxJobEnableToParties < ActiveRecord::Migration
  def change
    add_column :parties, :aux_jobs_enabled, :boolean, :null => false, :default => true
  end
end
