class AddTeamRelations < ActiveRecord::Migration
  def change
    add_foreign_key :team_members, :teams
  end
end
