package com.sinnerschrader.skillwill.domain.person;

import com.sinnerschrader.skillwill.domain.skills.PersonalSkill;
import com.sinnerschrader.skillwill.exceptions.SkillNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.util.StringUtils;

/**
 * Class holding all information about a person
 *
 * @author torree
 */
public class Person {

  @Id
  private String id;
  private List<PersonalSkill> skills;
  private String comment;

  @Version
  private Long version;

  // LDAP Details will be updates regularly
  private PersonalLdapDetails ldapDetails;

  public Person(String id) {
    this.id = id;
    this.skills = new ArrayList<>();
    this.ldapDetails = null;
  }

  public String getId() {
    return this.id;
  }

  public List<PersonalSkill> getSkills() {
    return this.skills;
  }

  public PersonalSkill getSkill(String name) {
    return this.skills.stream()
        .filter(s -> s.getName().equals(name))
        .findFirst()
        .orElse(null);
  }

  public void deleteSkill(String name) {
    PersonalSkill skill = getSkill(name);
    if (skill != null) {
      this.skills.remove(skill);
    }
  }

  public PersonalLdapDetails getLdapDetails() {
    return this.ldapDetails;
  }

  public void setLdapDetails(PersonalLdapDetails ldapDetails) {
    this.ldapDetails = ldapDetails;
  }

  public void addUpdateSkill(String name, int skillLevel, int willLevel) {
    // Remove old skill if existing...
    Optional<PersonalSkill> existing = skills.stream()
        .filter(s -> s.getName().equals(name))
        .findFirst();
    if (existing.isPresent()) {
      existing.get().setSkillLevel(skillLevel);
      existing.get().setWillLevel(willLevel);
    } else {
      this.skills.add(new PersonalSkill(name, skillLevel, willLevel));
    }
  }

  public void removeSkill(String name) {
    PersonalSkill skill = skills.stream()
        .filter(s -> s.getName().equals(name))
        .findAny()
        .orElseThrow(() -> new SkillNotFoundException("user does not have skill"));
    skills.remove(skill);
  }

  public String getComment() {
    return this.comment;
  }

  public void setComment(String comment) {
    this.comment = StringUtils.isEmpty(comment) ? null : comment;
  }

  public JSONObject toJSON() {
    JSONObject obj = new JSONObject();
    obj.put("id", this.id);
    obj.put("comment", this.comment);

    if (this.ldapDetails != null) {
      obj.put("firstName", ldapDetails.getFirstName());
      obj.put("lastName", ldapDetails.getLastName());
      obj.put("mail", ldapDetails.getMail());
      obj.put("phone", ldapDetails.getPhone());
      obj.put("location", ldapDetails.getLocation());
      obj.put("title", ldapDetails.getTitle());
    }

    JSONArray skills = new JSONArray();
    for (PersonalSkill s : this.skills) {
      skills.put(s.toJSON());
    }

    obj.put("skills", skills);
    return obj;
  }

}