class AddNakkitypeInfoRefToNakkitype < ActiveRecord::Migration
  def change
    add_column :nakkitypes, :nakkitype_info_id, :integer
    add_index :nakkitypes, :nakkitype_info_id
  end
end
