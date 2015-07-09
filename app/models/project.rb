class Project < ActiveRecord::Base
  belongs_to_and_has_many :team_members
  has_many :tasks
end
