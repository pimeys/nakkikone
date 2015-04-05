class SetNakkitypeInfoAsRequired < ActiveRecord::Migration
  def up
    change_column_null :nakkitypes, :nakkitype_info_id, false
  end

  def down
    change_column_null :nakkitypes, :nakkitype_info_id, true
  end
end
