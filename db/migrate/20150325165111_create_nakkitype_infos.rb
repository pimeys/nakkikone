class CreateNakkitypeInfos < ActiveRecord::Migration
  def change
    create_table :nakkitype_infos do |t|
      t.integer :id
      t.string :title
      t.text :description

      t.timestamps
    end
    add_index :nakkitype_infos, :id
  end
end
