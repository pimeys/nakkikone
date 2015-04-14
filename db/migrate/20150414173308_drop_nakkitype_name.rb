class DropNakkitypeName < ActiveRecord::Migration
  def up
    remove_column :nakkitypes, :name
  end

  def down
    add_column :nakkitypes, :name, :string
  end
end
