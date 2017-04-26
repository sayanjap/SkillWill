package com.sinnerschrader.skillwill.ldap;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import com.sinnerschrader.skillwill.misc.EmbeddedLdap;
import com.sinnerschrader.skillwill.services.LdapService;
import com.unboundid.ldap.sdk.LDAPException;
import java.io.IOException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Unit test for LdapLogin
 *
 * @author torree
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class LdapLoginTest {

  @Autowired
  private EmbeddedLdap ldap;

  @Autowired
  private LdapService ldapService;

  @Before
  public void setUp() throws IOException, LDAPException {
    ldap.reset();
  }

  @Test
  public void testValidCredentials() {
    assertTrue(ldapService.canAuthenticate("foobar", "fleischcreme"));
  }

  @Test
  public void testInvalidUser() {
    assertFalse(ldapService.canAuthenticate("IAmUnknown", "fleischcreme"));
  }

  @Test
  public void testInvalidPassword() {
    assertFalse(ldapService.canAuthenticate("foobar", "cremefleisch"));
  }

}