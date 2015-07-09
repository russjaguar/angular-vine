class AddRelations < ActiveRecord::Migration
  def change
    add_foreign_key :tasks, :team_members
    add_foreign_key :tasks, :projects
    create_join_table :projects, :team_members
  end
end
