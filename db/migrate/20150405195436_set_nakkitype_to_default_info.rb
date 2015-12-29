class SetNakkitypeToDefaultInfo < ActiveRecord::Migration
  def up
    Nakkitype.update_all "nakkitype_info_id = 1"
  end

  def down
    Nakkitype.update_all "nakkitype_info_id = NULL"
  end
end
