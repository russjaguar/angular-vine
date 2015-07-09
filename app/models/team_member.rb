class TeamMember < ActiveRecord::Base
  belongs_to_and_has_many :projects
  belongs_to :team
end
